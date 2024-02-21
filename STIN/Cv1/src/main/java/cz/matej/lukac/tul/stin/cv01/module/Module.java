package cz.matej.lukac.tul.stin.cv01.module;

import cz.matej.lukac.tul.stin.cv01.processors.IProcessor;
import cz.matej.lukac.tul.stin.cv01.transformers.ITransformer;

import java.util.List;

public class Module {
    private ITransformer intTransformator;
    private List<IProcessor> processorList;
}
